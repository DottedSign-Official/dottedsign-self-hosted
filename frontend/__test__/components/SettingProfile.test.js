import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";
import * as USER from "../constants/user";
import * as KEYBOARD from "../constants/keyboard";

import SettingProfile from "../../components/SettingProfile";

jest.mock("react-i18next");
const inputPlaceholders = {
  full_name: /setting_profile_placeholder_full_name/i,
  first_name: /setting_profile_placeholder_first_name/i,
  email: /setting_profile_placeholder_email/i,
  telephone: /setting_profile_placeholder_telephone/i,
  address: /setting_profile_placeholder_address/i,
  organization: /setting_profile_placeholder_organization/i,
  nationality: /setting_profile_placeholder_nationality/i,
};
const keys = Object.keys(inputPlaceholders);

const profile = {
  full_name: USER.PROFILE1.FULL_NAME,
  first_name: USER.PROFILE1.FIRST_NAME,
  email: USER.PROFILE1.EMAIL,
  telephone: USER.PROFILE1.TELEPHONE,
  address: USER.PROFILE1.ADDRESS,
  organization: USER.PROFILE1.ORGANIZATION,
  nationality: USER.PROFILE1.NATIONALITY,
};

const newProfile = {
  full_name: USER.PROFILE2.FULL_NAME,
  first_name: USER.PROFILE2.FIRST_NAME,
  email: USER.PROFILE2.EMAIL,
  telephone: USER.PROFILE2.TELEPHONE,
  address: USER.PROFILE2.ADDRESS,
  nationality: USER.PROFILE2.NATIONALITY,
  organization: USER.PROFILE2.ORGANIZATION,
};

describe("SettingProfile Components", () => {
  keys.forEach((key) => {
    test(`onSubmit should returns {${key}:${newProfile[key]}} when type ${inputPlaceholders[key]} and submit.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen } = setup(
        <SettingProfile
          isLoading={false}
          onSubmit={onSubmit}
          initialValue={profile}
        />,
      );

      await user.click(screen.getByText(/edit/i));
      screen.getByPlaceholderText(inputPlaceholders[key]).focus();
      await user.keyboard(KEYBOARD.CTRL_A_DELETE);
      await user.keyboard(newProfile[key]);
      await user.click(screen.getByText(/save/i));
      expect(onSubmit.mock.calls.pop()[0]).toMatchObject({
        ...profile,
        [key]: newProfile[key],
      });
    });
  });

  keys.forEach((key) => {
    test(`Default value ${profile[key]} of Edit mode should shown in input ${inputPlaceholders[key]}.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen } = setup(
        <SettingProfile
          isLoading={false}
          onSubmit={onSubmit}
          initialValue={profile}
        />,
      );
      await user.click(screen.getByText(/edit/i));
      const input = screen.getByPlaceholderText(inputPlaceholders[key]);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(profile[key]);
    });
  });

  keys.forEach((key) => {
    test(`Default value ${profile[key]} of View mode should shown in input ${inputPlaceholders[key]}.`, async () => {
      const onSubmit = jest.fn();

      const { screen } = setup(
        <SettingProfile
          isLoading={false}
          onSubmit={onSubmit}
          initialValue={profile}
        />,
      );
      const input = screen.getByText(profile[key]);
      expect(input).toBeInTheDocument();
    });
  });

  test("Save button and cancel button should show in Document when click edit.", async () => {
    const { user, screen } = setup(
      <SettingProfile isLoading={false} initialValue={profile} />,
    );

    await user.click(screen.getByText(/edit/i));
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
  });

  test("Edit button should show in Document when click cancel.", async () => {
    const { user, screen } = setup(
      <SettingProfile isLoading={false} initialValue={profile} />,
    );

    await user.click(screen.getByText(/edit/i));
    await user.click(screen.getByText(/cancel/i));
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });

  keys.forEach((key) => {
    test(`Value ${profile[key]} should not changed after type ${newProfile[key]} and cancel.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen } = setup(
        <SettingProfile
          isLoading={false}
          onSubmit={onSubmit}
          initialValue={profile}
        />,
      );

      await user.click(screen.getByText(/edit/i));
      screen.getByPlaceholderText(inputPlaceholders[key]).focus();
      await user.keyboard(KEYBOARD.CTRL_A_DELETE);
      await user.keyboard(newProfile[key]);
      await user.click(screen.getByText(/cancel/i));
      const input = screen.getByText(profile[key]);
      expect(input).toBeInTheDocument();
    });
  });

  for (let index = 0; index < keys.length - 1; index++) {
    const currentKey = keys[index];
    const nextKey = keys[index + 1];
    test(`Focus should change from ${currentKey} to ${nextKey} when type enter.`, async () => {
      const { user, screen } = setup(
        <SettingProfile isLoading={false} initialValue={profile} />,
      );
      await user.click(screen.getByText(/edit/i));
      screen.getByPlaceholderText(inputPlaceholders[currentKey]).focus();
      await user.keyboard(KEYBOARD.ENTER);
      expect(document.activeElement).toBe(
        screen.getByPlaceholderText(inputPlaceholders[nextKey]),
      );
    });
  }
});
