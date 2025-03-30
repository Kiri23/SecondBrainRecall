---
title: Liskov Substitution Principle (LSP) in Swift - Ramdhas - Medium
tags: Programming
createdAt: Sat Mar 29 2025 15:13:36 GMT-0400 (Atlantic Standard Time)
updatedAt: Sat Mar 29 2025 15:15:55 GMT-0400 (Atlantic Standard Time)
---


- The [[Liskov substitution principle | Liskov Substitution Principle]] (LSP) is a concept in object-oriented programming that ensures subclasses can be used in place of their base class without breaking the expected behavior of the program, and this principle is essential in Swift programming to maintain seamless and predictable functionality.
- A subclass must not introduce stricter conditions than the base class, change the meaning of a method's behavior, or throw unexpected errors when used in place of its superclass, as these actions would violate the LSP and create inconsistencies in the program.
- The example of a [[Credit card | credit card]] payment system is used to illustrate LSP compliance, where a base class CreditCard is defined with a makePayment method, and then subclasses VisaCard and [[Mastercard | MasterCard]] are created with unique behaviors, such as offering cashback and supporting installment payments, respectively, while maintaining LSP compliance.
- The VisaCard subclass adds a cashback feature without breaking the makePayment method, and the MasterCard subclass introduces a new method makePaymentInInstallments while still honoring the makePayment method, demonstrating that both subclasses can be used interchangeably where CreditCard is expected.
- Common LSP violations to avoid include removing or changing the base method, changing the expected behavior, and throwing unexpected errors, as these actions would create inconsistencies and break the LSP.
- Following the LSP ensures that subclasses work seamlessly and predictably in place of their base class, and it is essential to maintain expected behavior across base and subclass, ensure subclass functions do not introduce stricter conditions, and make sure any function that works with the base class also works with its subclasses.
- The concept of LSP is related to other principles, such as the [[Interface segregation principle | Interface Segregation Principle]] (ISP), which states that classes should have small, focused interfaces to avoid unnecessary dependencies, and understanding these principles is crucial for writing clean, maintainable, and scalable code.
- [[SOLID | Solid Principle]]


## Sources
- [website](https://medium.com/@ramdhasm5/3-liskov-substitution-principle-lsp-solid-principle-fc23a473939c)
