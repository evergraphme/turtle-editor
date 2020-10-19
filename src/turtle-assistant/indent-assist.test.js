import * as indent from './indent-assist';
import { turtle } from '../turtle-parser';
import { Changeset, parseNextInput } from './changeset';
import { assistants } from '.';

describe('statement', () => {
  test('indent after subject', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me'),
      input: ' ',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  ');
  });

  test('indent after dot/triples done', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :like :apples '),
      input: '.',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.replacement()).toBe(':me\n  :like :apples .\n');
  });

  test('indent after semicolon/new predicate', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :like :apples'),
      input: ';',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  :like :apples;\n  ');
  });

  test('indent after comma/new object', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :like :apples'),
      input: ',',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  :like\n    :apples,\n    ');
  });

  test('indent after comma/yet another object', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :like\n    :apples,\n    :oranges'),
      input: ',',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  :like\n    :apples,\n    :oranges,\n    ');
  });

  test('indent after comma/new object, even after a semi-colon', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :like :apples;\n  :dislike :orange;\n  :favor :bananas'),
      input: ',',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  :like :apples;\n  :dislike :orange;\n  :favor\n    :bananas,\n    ');
  });

  test('indent after comma/yet another object, even after a semi-colon', () => {
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':me\n  :dislike :bananas;\n  :like\n    :apples,\n    :oranges'),
      input: ',',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.change).toBe(':me\n  :dislike :bananas;\n  :like\n    :apples,\n    :oranges,\n    ');
  });

  test('disallow whitespace unless accepted by indentation rules', () => {
    // processed [ ] => [:i\n   ] <= 3 spaces!!
    const changeset = new Changeset({
      parser: turtle.turtleDoc.test(':ws\n  '),
      input: ' \n\t',
    });
    changeset.parseAllInput(assistants);
    expect(changeset.parser.text).toBe(':ws\n  ');
    expect(changeset.change).toBe(':ws\n  ');
  });

  test.todo('turn tab/newline to space where applicable');
  // Tabs seems to be accepted??

  // Seems leading whitespace is not accepted by parser, move this test elsewhere?
  test.todo('prohibit leading space on newline');
});
