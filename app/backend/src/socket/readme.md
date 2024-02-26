This dir is for our beloved websockets. The gateway and module in here are the 'main' server, that is imported by chatsocket and gamesocket. They are essentially the same server, this is just a way to split up functionality. The reason behind this, is that ever user will be reachable through a single client id, instead of a different one for every server/namespace.

We do however emulate a namespace through our nomenclature. Message for the chatsocket should be preceded with chat/, like so:

chat/message

Message for the gameserver should be preceded by game/, like so:

game/some_var