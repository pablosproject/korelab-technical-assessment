import { DataSource } from 'typeorm';
import { Product } from '../src/product/entities/product.entity';
import { Task } from '../src/task/entities/task.entity';
import { ProductProperties } from 'src/product/entities/product-properties.entity';

require('dotenv').config({ path: './.env' });

const db = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['../**/*.{entity,view}.{js,ts}'],
});

const seed = async () => {
  console.log(`Seeding...`);

  await db.initialize();

  await db.query(`TRUNCATE "products" CASCADE;`);

  try {
    const savedProducts: Product[] = [];
    for (let i = 0; i < 100; i++) {
      const product = new Product();
      product.name = `Product ${i}`;

      const productProperties = new ProductProperties();
      productProperties.properties = { description: `This is Product ${i}` };

      await db.manager.save(productProperties);
      product.productProperties = productProperties;

      const savedProduct = await db.manager.save(product);

      savedProducts.push(savedProduct);
    }

    const productTasks = savedProducts.flatMap((product) => {
      const tasks: Task[] = [];
      for (let i = 0; i < 20; i++) {
        const task = new Task();
        task.title = `Task ${i} for Product ${product.id}`;
        task.description = `This is Task ${i} for Product ${product.id}`;
        task.dueAt = new Date();
        task.product = product;

        tasks.push(task);
      }

      return tasks;
    });

    await db.manager.save(productTasks);

    console.log(`Seeded 🌱`);
  } finally {
    await db.destroy();
  }
};

seed();
