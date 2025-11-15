import { ApiProperty } from '@nestjs/swagger';

export class PageDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly currentPage: number;

  @ApiProperty()
  readonly totalPages: number;

  constructor(data: T[], totalItems: number, page: number, limit: number) {
    this.data = data;
    this.totalItems = totalItems;
    this.currentPage = page;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}
