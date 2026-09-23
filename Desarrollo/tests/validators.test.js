const {
  toPositiveInteger,
  validateAuthor,
  validatePost,
  validateComment,
} = require('../src/utils/validators');

describe('Validadores', () => {
  test('acepta números enteros positivos y cadenas numéricas', () => {
    expect(toPositiveInteger(7)).toBe(7);
    expect(toPositiveInteger('7')).toBe(7);
  });

  test('rechaza valores que no representan IDs válidos', () => {
    const invalidValues = [
      true,
      false,
      null,
      undefined,
      '',
      '1.5',
      '1e2',
      0,
      -1,
      {},
      [],
    ];

    invalidValues.forEach((value) => {
      expect(toPositiveInteger(value)).toBeNull();
    });
  });

  test('rechaza cuerpos ausentes o inválidos', () => {
    expect(validateAuthor(undefined)).toContain(
      'body debe ser un objeto JSON válido'
    );
    expect(validatePost(null)).toContain(
      'body debe ser un objeto JSON válido'
    );
    expect(validateComment([])).toContain(
      'body debe ser un objeto JSON válido'
    );
  });

  test('valida longitudes y tipos de author', () => {
    const longName = 'a'.repeat(121);

    expect(
      validateAuthor({
        name: longName,
        email: 'ana@example.com',
      })
    ).toContain('name no puede superar los 120 caracteres');

    expect(
      validateAuthor({
        name: 'Ana',
        email: 'ana@example.com',
        bio: 123,
      })
    ).toContain('bio debe ser texto o null');
  });

  test('valida longitudes y tipos de post', () => {
    const longTitle = 'a'.repeat(201);

    const errors = validatePost({
      author_id: true,
      title: longTitle,
      content: 'Contenido',
      published: 'true',
    });

    expect(errors).toContain('author_id debe ser un entero positivo');
    expect(errors).toContain('title no puede superar los 200 caracteres');
    expect(errors).toContain('published debe ser booleano');
  });

  test('rechaza IDs booleanos en comments', () => {
    const errors = validateComment({
      post_id: true,
      author_id: false,
      content: 'Comentario',
    });

    expect(errors).toContain('post_id debe ser un entero positivo');
    expect(errors).toContain('author_id debe ser un entero positivo');
  });
});