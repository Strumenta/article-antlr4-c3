import {KotlinParserVisitor} from "./parser/KotlinParserVisitor";
import {ScopedSymbol, SymbolTable, VariableSymbol} from "antlr4-c3";
import {AbstractParseTreeVisitor} from "antlr4ts/tree";
import {VariableDeclarationContext} from "./parser/KotlinParser";

export class SymbolTableVisitor extends AbstractParseTreeVisitor<SymbolTable> implements KotlinParserVisitor<SymbolTable> {
    readonly symbolTable: SymbolTable;
    scope: ScopedSymbol;

    constructor(symbolTable: SymbolTable = new SymbolTable("", {})) {
        super();
        this.symbolTable = symbolTable;
    }

    protected defaultResult(): SymbolTable {
        return this.symbolTable;
    }

    visitVariableDeclaration = (ctx: VariableDeclarationContext) => {
        this.symbolTable.addNewSymbolOfType(VariableSymbol, this.scope, ctx.simpleIdentifier().text);
        return this.visitChildren(ctx);
    };

}