import { ImageFileType } from "./ImageFileType";

export type OfferType = {
  _id: string;
  propertyType: string;
  location: string;
  district: string;
  rooms: number;
  floor: number;
  totalFloors?: number;
  number: string;
  currency: string;
  area: number;
  yearOfBuilding: Date;
  description: string;
  price: number;
  visited: boolean;
  images: ImageFileType[];
  constructionType?: string;
  title: string;
  address?: string;
  baths?: number;
  heating?: boolean,
  features?: string[],
  tags?: string[],
  isNew?: boolean,
  exclusive?: boolean
};


export enum OfferFormDataEnum {
  PropertyType = "propertyType",
  Location = "location",
  District = "district",
  Rooms = "rooms",
  Floor = "floor",
  Price = "price",
  Currency = "currency",
  Area = "area",
  // TODO: date of building
  YearOfBuilding = "yearOfBuilding",
  Description = "description",
  Images = "images",
}
