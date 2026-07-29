# Everdell: backfill Characters onto stored games instead of making the field optional

`EverdellPlayer.character` is required, but every game saved before Characters
existed has players without one. The storage mapper drops any record that fails
its schema, so adding a required field would have silently deleted a player's
entire Everdell history on the first load after the update.

## Decision

A pure function runs over the stored player records before they are parsed and
guarantees each one a Character, assigning the ones nobody claims in catalogue
order and never overwriting a Character that is already there. The result is
persisted the next time the game is saved.

## Why

The alternatives were worse. An optional `character` would push a `null` case
into every reader — the picker, the podium, the entity — for the sake of games
that will all have been backfilled after one load. Accepting the data loss was
never acceptable: the app has no server copy, so a discarded game is gone.

The cost is that a synthesised Character is indistinguishable from a chosen one.
That is tolerable because a Character carries no meaning beyond identity: it does
not affect scoring, ranking or the winner, so a wrong guess about a game played
before the feature existed costs the player nothing. It is, however, effectively
irreversible — once written, the original absence cannot be recovered.

Assignment is by catalogue order over the unclaimed Characters rather than plain
player index, because a partially-backfilled game (some players already having
one) would otherwise collide with an existing Character and break uniqueness
within the game.

The function knows nothing about storage or validation, which keeps it directly
testable and leaves the mapper as the only place aware that legacy records exist.
