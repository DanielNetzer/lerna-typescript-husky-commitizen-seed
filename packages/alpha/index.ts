export class Hello {
    constructor(who?: string) {
        console.log(`hello ${who ? who : 'world'}`);
    }
}