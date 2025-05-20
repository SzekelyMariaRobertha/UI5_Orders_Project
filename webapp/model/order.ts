export interface Customer {
    CompanyName: string;
  }
  
  export interface Employee {
    FirstName: string;
    LastName: string;
  }
  
  export interface Shipper {
    CompanyName: string;
  }
  
  export interface Order {
    OrderID: number;
    CustomerID: string;
    EmployeeID: string;
    OrderDate: string;
    RequiredDate: string;
    ShippedDate: string;
    ShipVia: string;
    Freight: string;
    ShipName: string;
    ShipAddress: string;
    ShipCity: string;
    ShipRegion: string;
    ShipPostalCode: string;
    ShipCountry: string;
    Customer: Customer;
    Employee: Employee;
    Shipper: Shipper;
  }
  