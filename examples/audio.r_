-- some problem with eventloop/memory leak
-- causes tracks to go out of sync

to kick ("examples/kick.wav" play)
to hihat (
  dup
  ("examples/hihat.wav" play) when
  cycle
)

to drums (
  (hihat) every 250 ms
  (kick) every 500 ms
)

1 0 0 1
drums

