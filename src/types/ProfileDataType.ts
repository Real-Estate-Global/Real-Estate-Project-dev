import { ImageFileType } from "./ImageFileType";

export type ProfileDataType = {
  name: string;
  email: string;
  password: string;
  profileType: string;
  phoneNumber: string;
  watermark?: ImageFileType | string;
};

export enum SignupFormDataEnum {
  Name = "name",
  Email = "email",
  PhoneNumber = "phoneNumber",
  ProfileType = "profileType",
  Password = "password",
  ConfirmedPassword = "confirmedPassword",
};
