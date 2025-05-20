export interface Category {
  CategoryID: number;
  CategoryName: string;
  Description: string;
}

export interface Supplier {
  SupplierID: number;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string;
  HomePage: string;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  SupplierID: number;
  CategoryID: number;
  QuantityPerUnit: string;
  UnitPrice: string;
  UnitsInStock: string;
  UnitsOnOrder: string;
  ReorderLevel: string;
  Discontinued: string;
  Category: Category;
  Supplier: Supplier;
}

export interface SelectedProduct extends Product {
  Quantity: string;
}