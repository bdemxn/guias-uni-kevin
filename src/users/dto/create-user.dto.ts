import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ required: true, example: "kevin@email.com" })
  email: string

  @ApiProperty({ required: true, example: "Kevin Bonilla" })
  name: string

  username?: string

  @ApiProperty({ required: true, example: "Hola1234" })
  password: string

  @ApiProperty({ required: true, example: "Tenant ID" })
  tenantId: number
}
