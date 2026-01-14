import { Module } from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { SubcribersController } from './subcribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcriber, SubcriberSchema } from './schemas/subcriber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subcriber.name, schema: SubcriberSchema }])],
  controllers: [SubcribersController],
  providers: [SubcribersService]
})
export class SubcribersModule { }
