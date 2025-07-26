import { ImageFileType, WatermarkType } from "./ImageFileType";

export const enum ProfileTypeEnum {
  Individual = "Частно лице",
  Agency = "Агенция",
  Admin = "Админ",
}

export type ProfileDataType = {
  name: string;
  email: string;
  password: string;
  profileType: ProfileTypeEnum;
  phoneNumber: string;
  watermark?: WatermarkType;
  avatar?: ImageFileType | null;
  agencyName?: string;
  agencyEik?: number;
  role?: string;
};

export enum SignupFormDataEnum {
  Name = "name",
  Email = "email",
  PhoneNumber = "phoneNumber",
  ProfileType = "profileType",
  Password = "password",
  ConfirmedPassword = "confirmedPassword",
  AgencyName = "agencyName",
  AgencyEik = "agencyEik",
  Role = "Role"
};
