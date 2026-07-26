import { readFileSync } from 'fs';
import { join } from 'path';

describe('Grid boolean header visibility', () => {
  const styles = readFileSync(join(__dirname, '../../styles.scss'), 'utf8');
  const utilsSource = readFileSync(join(__dirname, '../services/utils.service.ts'), 'utf8');

  it('hides header text only for selection columns', () => {
    expect(styles).toMatch(/\.ag-header-cell\.sitmun-selection-header[\s\S]*?\.ag-header-cell-comp-wrapper\s*\{\s*display:\s*none;/);
  });

  it('uses selection header class on checkbox columns and left-aligned headers on boolean columns', () => {
    expect(utilsSource).toMatch(
      /getSelCheckboxColumnDef\(\)\s*\{[\s\S]*?headerClass:\s*'sitmun-selection-header'/
    );
    expect(utilsSource).toMatch(
      /getRowCheckboxColumnDef\(\)\s*\{[\s\S]*?headerClass:\s*'sitmun-selection-header'/
    );

    const booleanDef = utilsSource.match(/getBooleanColumnDef[(][\s\S]*?\n {2}[}]/)?.[0] ?? '';
    expect(booleanDef).toContain("cellClass: 'sitmun-centered-cell'");
    expect(booleanDef).not.toContain("headerClass: 'sitmun-centered-header'");
  });
});
