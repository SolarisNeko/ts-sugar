const fs = require('fs');
const path = require('path');

const srcDir = './src'; // 源代码目录
const indexPath = './src/index.ts'; // 自动生成的 index.ts 文件路径

// 遍历指定目录，生成导出语句
function generateExportStatements(dirPath) {
    let exportStatements = '';
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            exportStatements += generateExportStatements(filePath);
        } else if (path.extname(file) === '.ts' && file !== 'index.ts') {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            if (fileContent.includes('export')) {
                const fileName = path.basename(file, '.ts');
                const relativePath = path.relative(srcDir, filePath).slice(0, -3).replace(/\\/g, '/'); // 将反斜杠替换为斜杠
                exportStatements += `export * from './${relativePath}';\n`;
            }
        }
    });
    return exportStatements;
}

// 生成 index.ts 文件内容
let indexContent = '';
indexContent += '// Auto-generated index file\n\n';
indexContent += generateExportStatements(srcDir);

// 将生成的内容写入 index.ts 文件
fs.writeFileSync(indexPath, indexContent);

console.log('index.ts file generated successfully!');
