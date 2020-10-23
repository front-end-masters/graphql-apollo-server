import { Resolver, Mutation, Query, Arg } from 'type-graphql';
import { Book } from '../models/book.model';
import { CreateBookInput, UpdateBookInput } from '../inputs/book.input';

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books(): Promise<Book[]> {
    return Book.find();
  }

  @Query(() => Book)
  book(@Arg('id') id: string): Promise<Book | undefined> {
    return Book.findOne({ where: { id } });
  }

  @Mutation(() => Book)
  async createBook(@Arg('data') data: CreateBookInput): Promise<Book> {
    const book = Book.create(data);
    await book.save();
    return book;
  }

  @Mutation(() => Book)
  async updateBook(@Arg('id') id: string, @Arg('data') data: UpdateBookInput): Promise<Book> {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      throw new Error(`Book (id: ${id}) not found!`);
    }

    Object.assign(book, data);
    await book.save();

    return book;
  }

  @Mutation(() => Boolean)
  async deleteBook(@Arg('id') id: string): Promise<boolean> {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      throw new Error(`Book (id: ${id}) not found!`);
    }

    await book.remove();

    return true;
  }
}
