import cors from 'cors';
import express from 'express';
import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); // To receive JSON from API
const PORT = 5000;

app.post('/generate', (req, res) => {
  try {
    const { dataTable, editableTable, form, locale, type, profession } = req.body;

    if (!profession) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Missing 'profession' in request.",
      });
    }

    const professionName = lodash.kebabCase(String(profession)); // Convert profession name to kebab-case

    const files = [
      {
        content: dataTable,
        path: `pages/${professionName}/${professionName}-data-table.tsx`,
      },
      {
        content: editableTable,
        path: `pages/${professionName}/${professionName}-editable-table.tsx`,
      },
      {
        content: form,
        path: `pages/${professionName}/${professionName}-form.tsx`,
      },
      {
        content: `
          export * from './${professionName}-data-table';\nexport * from './${professionName}-editable-table';\nexport * from './${professionName}-form';
        `.trim(),
        path: `pages/${professionName}/index.ts`,
      },
      {
        content: locale,
        path: `locales/vi/${professionName}.json`,
      },
      {
        content: type,
        path: `types/${professionName}.ts`,
      },
    ];

    const results = files.map(({ content, path: filePath }) => {
      if (content) {
        const fullPath = path.join(__dirname, filePath);

        if (!content) {
          return { path: filePath, status: 'skipped', reason: 'No content provided' };
        }

        if (fs.existsSync(fullPath)) {
          console.log(`⚠️ File already exists, skipping: ${fullPath}`);
          return { path: filePath, status: 'skipped', reason: 'File already exists' };
        }

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, String(content), 'utf-8');
        console.log(`✅ File created: ${fullPath}`);
        return { path: filePath, status: 'created' };
      }
    });
    res.json({
      success: true,
      message: `✅ Files processed successfully for ${profession}`,
      files: results,
    });
  } catch (error) {
    console.error('⚠️ Error generating files:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Error generating files',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
