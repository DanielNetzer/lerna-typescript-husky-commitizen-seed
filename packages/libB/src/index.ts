export class Hello {
  constructor(helloWho?: string) {
    console.log(`hello ${helloWho ? helloWho : "world"}`);
  }
}
