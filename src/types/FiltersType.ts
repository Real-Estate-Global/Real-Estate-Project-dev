export type FiltersType = {
  city: string;
  district: string;
  propertyType: string;
  budgetLowest: number;
  budgetHighest: number;
  areaLowest: number;
  areaHighest: number;
  floorLowest: number;
  floorHighest: number;
  roomsLowest: number;
  roomsHighest: number;
  yearOfBuildingLowest: number;
  yearOfBuildingHighest: number;
};

export enum FiltersTypeEnum {
  PropertyType = "propertyType",
  City = "city",
  District = "district",
  BudgetLowest = "budgetLowest",
  BudgetHighest = "budgetHighest",
  AreaLowest = "areaLowest",
  AreaHighest = "areaHighest",
  FloorLowest = "floorLowest",
  FloorHighest = "floorHighest",
  RoomsLowest = "roomsLowest",
  RoomsHighest = "roomsHighest",
  YearOfBuildingLowest = "yearOfBuildingLowest",
  YearOfBuildingHighest = "yearOfBuildingHighest",
}
