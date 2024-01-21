export interface Car {
  _id: string;
  brand: string;
  drive: string;
  id: number;
  imageUrl: string;
  name: string;
  price: string;
}

export interface AllCars {
  allCars: Car[];
}

export interface Modules {
  modules: Record<string, number>;
}

export interface GraphqlResponse<T = never> {
  data: {
    data: T;
    errors: unknown;
  };
}

export interface AllCarResponse extends GraphqlResponse<AllCars> {}

export interface RestfulResponse<T = never> {
  data: {
    data: T;
    modules: Record<string, number>;
  };
}

export interface AllCarRestFulResponse extends RestfulResponse<AllCars> {}

export interface ModulesRestFulResponse extends RestfulResponse<Modules> {}

export interface GetCarByNameResponse {
  data: {
    data: {
      getCarByName: Car[];
    };
  };
}

export interface GetCarByBrandResponse {
  data: {
    data: {
      getCarByBrand: Car[];
    };
  };
}

export interface GetCarByDriveResponse {
  data: {
    data: {
      getCarByDrive: Car[];
    };
  };
}

export interface CreateCarResponse {
  data: {
    data: {
      createCar: Car;
    };
  };
}

export interface DeleteCarResponse {
  data: {
    data: {
      deleteCar: Car;
    };
  };
}

export interface CarRequest {
  _id?: string;
  brand: string;
  drive: string;
  id?: number;
  imageUrl: string;
  name: string;
  price: string;
}

export interface NormalizedCarsEntity {
  entities?: {
    cars: Car[];
  };
  result?: number[];
}

export interface NormalizedEntity {
  cars: NormalizedCarsEntity;
}
