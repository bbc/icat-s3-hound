function isMethod(propertyName: string, value: string): boolean {
  return propertyName !== 'constructor' && typeof value === 'function';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function bind(obj: object): void {
  const propertyNames = Object.getOwnPropertyNames(obj.constructor.prototype);
  propertyNames.forEach((propertyName) => {
    const value = obj[propertyName];
    if (isMethod(propertyName, value)) {
      obj[propertyName] = value.bind(obj);
    }
  });
}
