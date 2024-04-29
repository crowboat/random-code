import * as fs from 'fs';

const readline = require('readline')

interface Product {
  asin: string;
  helpful: number[];
  aggregateScore: number;
}

// Function to parse the data file line by line
async function parseDataFile(filePath: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const productsMap: Map<string, Product> = new Map();

    const inputStream = fs.createReadStream(filePath);
    const lineReader = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity
    });

    lineReader.on('line', (line: string) => {
      const productData = JSON.parse(line);
      const { asin, helpful } = productData;
      const aggregateScore = 0;

      if (!productsMap.has(asin)) {
        productsMap.set(asin, { asin, helpful: [helpful], aggregateScore })
      } else {
        const existingProduct = productsMap.get(asin)!;
        existingProduct.helpful = existingProduct.helpful.concat(helpful);
        productsMap.set(asin, existingProduct)
      }
    });

    lineReader.on('close', () => {
      const products: Product[] = Array.from(productsMap.values());
      resolve(products);
    });

    lineReader.on('error', (error: any) => {
      reject(error);
    });
  });
}

function calculateAggregateScores(products: Product[]): Product[] {
    return products.map(product => {
        const aggregateScore = product.helpful.reduce((total, currentValue) => total + currentValue)
        return { ...product, aggregateScore } 
    })
}

function sortProducts(products: Product[]): Product[] {
    return products.sort((a, b) => {
        if (a.aggregateScore !== b.aggregateScore) {
            return b.aggregateScore - a.aggregateScore;
        } else {
            return products.filter(product => product.asin === b.asin).length - products.filter(product => product.asin === a.asin).length;
        }
    })
}

// Main function
async function main() {
    const filePath = 'helpful-reviews.json';
    const products = await parseDataFile(filePath);
    const productsWithAggregateScores = calculateAggregateScores(products);
    const sortedProducts = sortProducts(productsWithAggregateScores);

    sortedProducts.forEach(product => {
        console.log(`ASIN: ${product.asin}, Aggregate Scoe: ${product.aggregateScore}`)
    })
}

// Run the main function
main();
