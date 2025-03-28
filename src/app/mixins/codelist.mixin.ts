import { CodeList, CodeListService } from "@app/domain";
import { HalOptions, HalParam } from "@app/core";
import { config } from "@config";
import { firstValueFrom } from "rxjs";

/**
 * Interface defining the properties and methods required for the CodeList mixin.
 */
interface CodeListMixin {
  /**
   * Initializes code lists by fetching values from the service.
   * @param codeList - Array of code list names to initialize
   * @param codeListService - Service used to fetch code list data
   */
  initCodeLists(
    codeList: string[],
    codeListService: CodeListService
  ): void

  /**
   * Retrieves all values for a specific code list.
   * @param code - The code list name to retrieve
   * @returns Array of CodeList items for the specified code
   */
  codeList(code: string): CodeList[]

  /**
   * Finds a specific item in a code list by its value.
   * @param code - The code list name to search in
   * @param value - The value to find in the code list
   * @returns The matching CodeList item or undefined if not found
   */
  findInCodeList(code: string, value: string): CodeList
}

/**
 * A mixin that adds code list management functionality to a component.
 * This mixin provides methods for initializing, retrieving, and searching code lists.
 * 
 * @param Base - The base class to extend with the mixin functionality
 * @returns A new class that extends the base class with CodeList functionality
 */
export function codeListMixin<TBase extends Constructor>(Base: TBase) {

  return class extends Base implements CodeListMixin {

    protected codeListService: CodeListService;
    private codelists: Map<string, CodeList[]> = new Map();

    /**
     * Retrieves all values for a specific code list.
     * @param code - The code list name to retrieve
     * @returns Array of CodeList items for the specified code
     */
    codeList(code: string): CodeList[] {
      if (!this.codelists.has(code)) {
        console.error(`Code list ${code} not initialized`);
      }
      return this.codelists.get(code) || [];
    }

    /**
     * Gets the first item in a code list.
     * @param code - The code list name
     * @returns The first CodeList item or undefined if the list is empty
     */
    firstInCodeList(code: string): CodeList {
      return this.codeList(code)[0];
    }

    /**
     * Finds a specific item in a code list by its value.
     * @param code - The code list name to search in
     * @param value - The value to find in the code list
     * @returns The matching CodeList item or undefined if not found
     */
    findInCodeList(code: string, value: string): CodeList {
      return this.codeList(code).find(c => c.value === value);
    }

    /**
     * Initializes multiple code lists by fetching their values from the service.
     * Stores the sorted results in the codelists map.
     * 
     * @param codeList - Array of code list names to initialize
     * @returns Promise that resolves when all code lists are initialized
     */
    async initCodeLists(codeList: string[]): Promise<void[]> {
      return Promise.all(codeList.map(async code => {
        const list: CodeList[] = await firstValueFrom(this.getCodeListValues(code))
        this.codelists.set(code, list.sort((a, b) => a.description.localeCompare(b.description)));
      }));
    }

    /**
     * Fetches code list values from the service with appropriate parameters.
     * 
     * @param valueList - The name of the code list to fetch
     * @param notTraduction - Optional flag to skip language parameter
     * @returns Observable of CodeList array
     * @private
     */
    private getCodeListValues(valueList, notTraduction?) {
      const query: HalOptions = {
        params: [
          { key: 'codeListName', value: valueList }
        ]
      };
      if (!notTraduction) {
        let codelistLangValue = config.defaultLang;
        if (localStorage.lang) {
          codelistLangValue = localStorage.lang;
        }
        const param: HalParam = { key: 'lang', value: codelistLangValue };
        query.params.push(param);
      }

      return this.codeListService.getAll(query);
    }

  }
}
