import { eq } from "drizzle-orm";
import { db } from "../../../infrastructure/database/db.ts";
import {
  addressTable,
  customerOrderTable,
  customerTable,
  orderItemTable,
  orderTable,
} from "../../../infrastructure/schemas/index.ts";

import type {
  address,
  customer,
  customerOrder,
  newAddress,
  newCustomer,
  order,
  updateCustomer,
} from "../../../infrastructure/schemas/index.ts";

export class CustomerRepository {
  // CRUD básico para Customers
  async findAll(): Promise<customer[]> {
    return await db.select().from(customerTable);
  }

  async findById(id: number): Promise<customer | undefined> {
    const [result] = await db
      .select()
      .from(customerTable)
      .where(eq(customerTable.id, id));
    return result;
  }

  async create(data: newCustomer): Promise<customer> {
    const [result] = await db
      .insert(customerTable)
      .values(data)
      .returning();
    return result;
  }

  async update(
    id: number,
    data: updateCustomer,
  ): Promise<customer | undefined> {
    const [result] = await db
      .update(customerTable)
      .set(data)
      .where(eq(customerTable.id, id))
      .execute();
    return result.affectedRows ? await this.findById(id) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(customerTable)
      .where(eq(customerTable.id, id))
      .execute();

    return result.affectedRows > 0;
  }

  // Operações relacionadas a endereços
  async findAddressesByCustomerId(customerId: number): Promise<address[]> {
    return await db
      .select()
      .from(addressTable)
      .where(eq(addressTable.customerId, customerId));
  }

  async addAddress(
    customerId: number,
    addressData: Omit<newAddress, "customerId">,
  ): Promise<address> {
    const [result] = await db
      .insert(addressTable)
      .values({ ...addressData, customerId })
      .returning();
    return result;
  }

  async deleteAddress(addressId: number): Promise<boolean> {
    const result = await db
      .delete(addressTable)
      .where(eq(addressTable.id, addressId))
      .execute();

    return result.affectedRows > 0;
  }

  // Operações relacionadas a pedidos
  async findOrdersByCustomerId(customerId: number): Promise<order[]> {
    const results = await db
      .select({
        id: orderTable.id,
        price: orderTable.price,
        quantity: orderTable.quantity,
        orderDate: orderTable.orderDate,
        requiredDate: orderTable.requiredDate,
        shippedDate: orderTable.shippedDate,
        status: orderTable.status,
        comments: orderTable.comments,
      })
      .from(customerOrderTable)
      .innerJoin(
        orderTable,
        eq(customerOrderTable.orderId, orderTable.id),
      )
      .where(eq(customerOrderTable.customerId, customerId));

    return results;
  }

  async associateOrderWithCustomer(
    customerId: number,
    orderId: number,
  ): Promise<customerOrder> {
    const [result] = await db
      .insert(customerOrderTable)
      .values({ customerId, orderId })
      .returning();
    return result;
  }

  async removeOrderFromCustomer(
    customerId: number,
    orderId: number,
  ): Promise<boolean> {
    const result = await db
      .delete(customerOrderTable)
      .where(eq(customerOrderTable.customerId, customerId))
      .where(eq(customerOrderTable.orderId, orderId))
      .execute();

    return result.affectedRows > 0;
  }

  // Consultas complexas e agregações
  async getCustomerWithAddressesAndOrders(customerId: number) {
    const customer = await this.findById(customerId);
    if (!customer) return undefined;

    const addresses = await this.findAddressesByCustomerId(customerId);
    const orders = await this.findOrdersByCustomerId(customerId);

    return {
      ...customer,
      addresses,
      orders,
    };
  }

  async getOrderDetailsByCustomerId(customerId: number) {
    const orderDetails = await db
      .select({
        orderId: orderTable.id,
        orderDate: orderTable.orderDate,
        status: orderTable.status,
        itemCount: db.fn.count(orderItemTable.id),
        totalValue: db.fn.sum(
          db.sql`${orderItemTable.quantity} * ${orderItemTable.price}`,
        ),
      })
      .from(customerOrderTable)
      .innerJoin(
        orderTable,
        eq(customerOrderTable.orderId, orderTable.id),
      )
      .leftJoin(
        orderItemTable,
        eq(orderTable.id, orderItemTable.orderId),
      )
      .where(eq(customerOrderTable.customerId, customerId))
      .groupBy(orderTable.id, orderTable.orderDate, orderTable.status);

    return orderDetails;
  }
}
