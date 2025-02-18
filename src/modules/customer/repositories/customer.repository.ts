import { eq } from "drizzle-orm";
import { db } from "../../../infrastructure/database/db.ts";
import {
  addressSchema,
  customerOrderSchema,
  customerSchema,
  orderSchema,
} from "../../../infrastructure/schemas/index.ts";
import type {
  address,
  customer,
  customerOrder,
  newCustomer,
  order,
  updateCustomer,
} from "../../../infrastructure/schemas/index.ts";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export class CustomerRepository {
  async findAll(): Promise<customer[]> {
    return await db.select().from(customerSchema);
  }

  async findById(id: number): Promise<customer | undefined> {
    const [result] = await db
      .select()
      .from(customerSchema)
      .where(eq(customerSchema.id, id));
    return result;
  }

  async create(data: newCustomer): Promise<customer> {
    const [result] = await db
      .insert(customerSchema)
      .values(data)
      .returning();
    return result;
  }

  async update(
    id: number,
    data: updateCustomer,
  ): Promise<customer | undefined> {
    const [result] = await db
      .update(customerSchema)
      .set(data)
      .where(eq(customerSchema.id, id));
    return result.affectedRows ? await this.findById(id) : undefined;
  }

  async delete(id: number): Promise<MySqlRawQueryResult> {
    const result = await db
      .delete(customerSchema)
      .where(eq(customerSchema.id, id))
      .execute();

    return result;
  }

  // Address related operations
  async addAddress(
    customerId: number,
    addressData: Omit<address, "id" | "customerId">,
  ): Promise<address> {
    const [result] = await db
      .insert(addressSchema)
      .values({ ...addressData, customerId })
      .returning();
    return result;
  }

  async getCustomerAddresses(customerId: number): Promise<address[]> {
    return await db
      .select()
      .from(addressSchema)
      .where(eq(addressSchema.customerId, customerId));
  }

  async getCustomerOrders(customerId: number): Promise<order[]> {
    const results = await db
      .select({
        id: orderSchema.id,
        price: orderSchema.price,
        quantity: orderSchema.quantity,
        orderDate: orderSchema.orderDate,
        requiredDate: orderSchema.requiredDate,
        shippedDate: orderSchema.shippedDate,
        status: orderSchema.status,
        comments: orderSchema.comments,
      })
      .from(customerOrderSchema)
      .innerJoin(
        orderSchema,
        eq(customerOrderSchema.orderId, orderSchema.id),
      )
      .where(eq(customerOrderSchema.customerId, customerId));

    return results;
  }

  async addOrderToCustomer(
    customerId: number,
    orderId: number,
  ): Promise<customerOrder> {
    const [result] = await db
      .insert(customerOrderSchema)
      .values({ customerId, orderId })
      .returning();
    return result;
  }

  // Complex queries
  async getCustomerWithAddressesAndOrders(customerId: number) {
    const customer = await this.findById(customerId);
    if (!customer) return undefined;

    const addresses = await this.getCustomerAddresses(customerId);
    const orders = await this.getCustomerOrders(customerId);

    return {
      ...customer,
      addresses,
      orders,
    };
  }
}
