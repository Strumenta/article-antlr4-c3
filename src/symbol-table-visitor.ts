import {KotlinParserVisitor} from "./parser/KotlinParserVisitor";
import {RoutineSymbol, ScopedSymbol, SymbolTable, VariableSymbol} from "antlr4-c3";
import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {FunctionDeclarationContext, VariableDeclarationContext} from "./parser/KotlinParser";

export class SymbolTableVisitor extends AbstractParseTreeVisitor<SymbolTable> implements KotlinParserVisitor<SymbolTable> {
    constructor(
        protected readonly symbolTable = new SymbolTable("", {}),
        protected scope = symbolTable.addNewSymbolOfType(ScopedSymbol, undefined)) {
        super();
    }

    protected defaultResult(): SymbolTable {
        return this.symbolTable;
    }

    visitVariableDeclaration = (ctx: VariableDeclarationContext) => {
        this.symbolTable.addNewSymbolOfType(VariableSymbol, this.scope, ctx.simpleIdentifier().text);
        return this.visitChildren(ctx);
    };

    visitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
        return this.withScope(ctx, RoutineSymbol, [ctx.identifier().text], () => this.visitChildren(ctx));
    };

    protected withScope<T>(tree: ParseTree, type: new (...args: any[]) => ScopedSymbol, args: any[], action: () => T): T {
        const scope = this.symbolTable.addNewSymbolOfType(type, this.scope, ...args);
        scope.context = tree;
        this.scope = scope;
        try {
            return action();
        } finally {
            this.scope = scope.parent as ScopedSymbol;
        }
    }

}