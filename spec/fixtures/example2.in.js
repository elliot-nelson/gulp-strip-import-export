import { Foo } from './Foo';
import { Bar } from './Bar';

export class Baz {
    constructor() {
        this.foo = new Foo();
        this.bar = new Bar();
    }
}

export const BazTypeName = 'Baz';
