// eslint-disable-next-line max-len
export const GRAHPQL_ENDPOINT = `http://${process.env.NEXT_PUBLIC_GRAPHQL_HOST}:${process.env.NEXT_PUBLIC_GRAPHQL_PORT}/graphql`;

export const API_SSR_ENDPOINT = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

export const GET_ALL_CARS = `
{
  allCars {
    _id
    id
    brand
    name
    price
    drive
    imageUrl
  }  
}
`;
export const ADD_CAR_OLD = `
mutation (
    $id: Int!,
    $brand: String!,
    $name: String!,
    $price: Int!,
    $drive: String,
    $imageUrl: String
  ) {
    createCar(
      id: $id,
      brand: $brand,
      name: $name
      price: $price
      drive: $drive
      imageUrl: $imageUrl
    ){
      _id
      id
      brand
      name
      price
      drive
      imageUrl
    }
  }
`;

export const ADD_CAR = `
mutation (
  $input: CarInput!
  ) {
    createCar(
      input: $input
    ){
      _id
      id
      brand
      name
      price
      drive
      imageUrl
    }
  }
`;

export const UPDATE_CAR_OLD = `
mutation (
  $_id: String!
  $id: Int!,
  $brand: String!,
  $name: String!,
  $price: Int!,
  $drive: String,
  $imageUrl: String
  ) {
    updateCar(
      _id: $_id,
      id: $id,
      brand: $brand,
      name: $name,
      price: $price,
      drive: $drive,
      imageUrl: $imageUrl
    ){
      _id
      id
      brand
      name
      price
      drive
      imageUrl
    }
  }  
`;

export const UPDATE_CAR = `
mutation (
  $id: ID!
  $input: CarInput!
  ) {
    updateCar(
      id: $id
      input: $input
    ){
      _id
      id
    }
  }
`;

export const DELETE_CAR_OLD = `
mutation (
  $_id: String!
  ) {
    deleteCar(
      _id: $_id
    ){
      _id
      id
      brand
      name
      price
      drive
      imageUrl
    }
  }  
`;

export const DELETE_CAR = `
mutation (
  $id: ID!
  ) {
    deleteCar(
      id: $id
    ){
      _id,
      id,
      name
    }
  }
`;

export const GET_CARS_BY_NAME = `
query ( 
    $name: String!
  ) {
    getCarByName(
      name: $name
    ) {
      id
      brand
      name
      price
      drive
      imageUrl
    }  
  }
`;

export const GET_CARS_BY_BRAND = `
query ( 
    $brand: String!
  ) {
    getCarByBrand(
      brand: $brand
    ) {
      id
      brand
      name
      price
      drive
      imageUrl
    }  
  }
`;
export const GET_CARS_BY_DRIVE = `
query ( 
  $drive: String!
) {
  getCarByDrive(
    drive: $drive
  ) {
    id
    brand
    name
    price
    drive
    imageUrl
  }  
}
`;
