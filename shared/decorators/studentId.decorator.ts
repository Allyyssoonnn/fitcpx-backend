import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const StudentId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
   const request = ctx.switchToHttp().getRequest();
   return request.cod_aluno;
});
