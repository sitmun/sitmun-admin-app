/**
 * A generic constructor type that can be used as a base for mixins.
 * 
 * This type represents any class constructor that can be instantiated with any number of arguments
 * and returns an instance of type T. It's primarily used as a constraint for mixin functions
 * to ensure they can properly extend any class.
 * 
 * @template T - The type of object the constructor creates, defaults to empty object
 */
type Constructor<T = {}> = new (...args: any[]) => T;
