import {
  Button,
  Card,
  Group,
  Image,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "tabler-icons-react";

import { api, useFetchUserListQuery, useSignUpMutation } from "../../api_client/api";
import { useAppDispatch } from "../../store/store";
import { EMAIL_REGEX } from "../../util/util";
import type { ISignUpFormState } from "./loginUtils";

export const initialFormState: ISignUpFormState = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  passwordConfirm: "",
  email: "",
};

export function FirstTimeSetupPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signup, { isLoading, isSuccess }] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const { data: userList } = useFetchUserListQuery();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      passwordConfirm: "",
      email: "",
    },

    validate: {
      passwordConfirm: (value, values) => (value !== values.password ? t("settings.password.errormustmatch") : null),
      email: value => (!EMAIL_REGEX.test(value) ? t("modaluseredit.errorinvalidemail") : null),
    },
  });

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  useEffect(() => {
    if (isSuccess) {
      dispatch(api.endpoints.fetchUserList.initiate());
      navigate("/");
    }
  }, [navigate, isSuccess]);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = form.validate();
    if (!result.hasErrors) {
      const { email, first_name, last_name, password } = form.values;
      const username = form.values.username.toLowerCase();
      void signup({ email, first_name, last_name, username, password, is_superuser: true });
    }
  }

  return (
    <div
      style={{
        paddingTop: 150,
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        backgroundSize: "cover",
      }}
    >
      <Stack align="center" justify="flex-end">
        <Group>
          <Image height={80} fit="contain" src={dark ? "/logo-white.png" : "/logo.png"} />
          <span style={{ paddingLeft: 5, fontSize: 18 }}>
            <b>{t("login.name")}</b>
          </span>
        </Group>

        <div style={{ width: 500, margin: "auto" }}>
          <Card>
            <Stack>
              <Title order={3}>{t("login.firsttimesetup")}</Title>
              <form onSubmit={onSubmit}>
                <Stack>
                  <TextInput
                    required
                    icon={<User />}
                    placeholder={t("login.usernameplaceholder")}
                    name="username"
                    {...form.getInputProps("username")}
                  />
                  <TextInput
                    required
                    icon={<Mail />}
                    placeholder={t("settings.emailplaceholder")}
                    name="email"
                    {...form.getInputProps("email")}
                  />
                  <TextInput
                    required
                    icon={<User />}
                    placeholder={t("settings.firstnameplaceholder")}
                    name="firstname"
                    {...form.getInputProps("first_name")}
                  />
                  <TextInput
                    required
                    icon={<User />}
                    placeholder={t("settings.lastnameplaceholder")}
                    name="firstname"
                    {...form.getInputProps("last_name")}
                  />
                  <PasswordInput
                    icon={<Lock />}
                    placeholder={t("login.passwordplaceholder")}
                    name="password"
                    {...form.getInputProps("password")}
                  />
                  <PasswordInput
                    required
                    icon={<Lock />}
                    placeholder={t("login.confirmpasswordplaceholder")}
                    name="passwordConfirm"
                    {...form.getInputProps("passwordConfirm")}
                  />

                  <Button
                    variant="gradient"
                    gradient={{ from: "#D38312", to: "#A83279" }}
                    type="submit"
                    disabled={isLoading}
                  >
                    {t("login.signup")}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Card>
        </div>
      </Stack>
    </div>
  );
}
