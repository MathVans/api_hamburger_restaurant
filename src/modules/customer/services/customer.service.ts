import type { CustomerRepository } from "../repositories/customer.repository.ts";
import type {
  address,
  customer,
  newCustomer,
  updateCustomer,
} from "../../../infrastructure/schemas/index.ts";

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getAllCustomers(): Promise<customer[]> {
    return await this.customerRepository.findAll();
  }

  async getCustomerById(id: number): Promise<customer | undefined> {
    return await this.customerRepository.findById(id);
  }

  async createCustomer(data: newCustomer): Promise<customer> {
    return await this.customerRepository.create(data);
  }

  async updateCustomer(
    id: number,
    data: updateCustomer,
  ): Promise<customer | undefined> {
    return await this.customerRepository.update(id, data);
  }

  async deleteCustomer(id: number): Promise<string | boolean> {
    const result = await this.customerRepository.delete(id);
    
    return;
  }

  // Address operations
  async addCustomerAddress(
    customerId: number,
    addressData: Omit<address, "id" | "customerId">,
  ): Promise<address> {
    return await this.customerRepository.addAddress(customerId, addressData);
  }

  async getCustomerWithDetails(customerId: number) {
    return await this.customerRepository.getCustomerWithAddressesAndOrders(
      customerId,
    );
  }

  // Complex use: Get full customer detail plus order stats
  async getCustomerProfileWithStats(customerId: number) {
    const customerDetails = await this.customerRepository
      .getCustomerWithAddressesAndOrders(customerId);
    if (!customerDetails) return undefined;

    // Compute additional business logic - aggregate total orders and total spent
    const orders = customerDetails.orders;
    const orderCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => {
      // Assuming price is a number already. Adjust if needed.
      return sum + order.price * order.quantity;
    }, 0);

    return {
      ...customerDetails,
      orderCount,
      totalSpent,
    };
  }
}
