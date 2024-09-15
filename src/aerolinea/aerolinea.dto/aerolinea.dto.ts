/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;

 @IsDate()
 @IsNotEmpty()
 readonly fecha_fundacion: Date;

 @IsString()
 @IsNotEmpty()
 readonly pagina_web: string;
}