import BaseModel from "./baseModel";
export class UserModel extends BaseModel {
  static async create(name: string, email: string, password: string) {

    
    const userToCreate = {
      username: name,
      password: password,
      email: email,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    await this.queryBuilder().insert(userToCreate).table("users");
    let userId = await this.queryBuilder()
      .select("id")
      .table("users")
      .where("email", email);
    
       
    const role = {
      role_id: 2,
      user_id: userId[0].id,
    };
    await this.queryBuilder().insert(role).table("user_roles");
    return { name: name, email: email, password: password }
  }

  static async findByEmail(email:string) {
    let matchingEmail = await this.queryBuilder()
      .select("*")
      .from("users")
      .where("email", email);

    return matchingEmail;
  }

  static async findUserPermission(email) {
    console.log(email);
    
    let permissions = await this.queryBuilder()
      .select("permissions.name")
      .from("users")
      .join("user_roles", "users.id", "user_roles.user_id")
      .join("roles", "user_roles.role_id", "roles.id")
      .join("role_permissions", "roles.id", "role_permissions.role_id")
      .join("permissions", "role_permissions.permission_id", "permissions.id")
      .where("email", email);
  
    return permissions;
  }


}