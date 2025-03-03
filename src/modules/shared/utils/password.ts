import * as bcrypt from "bcrypt";

/**
 * Gera um hash para a senha
 * @param password Senha em texto plano
 * @returns Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password);
}

/**
 * Verifica se a senha corresponde ao hash
 * @param password Senha em texto plano
 * @param hash Hash armazenado
 * @returns true se a senha corresponder ao hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}