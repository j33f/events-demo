# A simple click event demo

This is a simple demo on how the events work in the browser.

## How to run

1. Clone the repo
2. Run `docker compose up`
3. Open `http://localhost:3000` in your browser
4. Open the console and click on the buttons
5. Observe

## onclick event

When we click on a button, the `onclick` event is triggered. The `onclick` event is a property of the button element. The `onclick` event is a function that is called when the button is clicked. It is not an emitted event! In a way, we say to the button: "Hey, when you are clicked, call this function". We give it an order. The button is not emitting an event, it is just listening to its very own `onclick` event and when it is triggered, it calls the function we gave him. We gave him the order to call the function when he is clicked. Eventually, the event is "bubbled" to its parents so that they can handle it, but it just stay into the HTML elements tree, unless some code transmit it outside of the tree.

## Event listener / Emitter

When we declare an event listener/emitter, it is just a messaging system. When someone (a component) have something to say, it emits a message (an event) with some data (the event payload). Eventually, if someone (another component, including himself) want to be notified when this kind of event is emitted, he can register a listener to this event. When the event is emitted, the listener is called with the event payload. When the one who wanted to be notified is not interested anymore, he can unregister the listener easily since he is the initiator of the "listening" process.

From the listener (component) point of view, it is a passive process. He just asked to be notified when something happen. He just stand by and wait for the event to be emitted.

On the other hand, the emitter does not know who is listening to it (and he not have to). It just emit the event. It is cool if someone listen to it, but it is not a problem if no one do.

Moreover, the listener can handle the event into its own execution context and use `this` to access its own properties. The emitter does not know anything about the listener and does not have to.

This is the most efficient way to handle events emitting / listening.

## Event emitting through the onclick event

If we want both event to be handled by the component itself AND other components, we can implement three different things:

### Emit the event and everyone listen to it

> This is the most common way to do it and far the most used one (and the most simple one, and the most efficient one)

Let's say that the Gertrude component wants to listen to its own clicks. We can add a handler to its `onclick` event that emit an event through the global event emitter. Then, into its own code, Gertrude can listen to this event and handle it.
Let's say now that the Gontrand component wants to listen to the Gertrude clicks. To do so, he can listen to the event emitted by Gertrude through the global event emitter.

That way, both Gertrude and Gontrand can listen to the same event and handle it. They also can stop listening to it whenever they want as they are the initiators of the "listening" process.

To do so, whe can do something like this:

```js
// Gertrude component
const eventEmitter = new EventEmitter();
const gertrude = document.querySelector('#gertrude')
gertrude.onclick = () => {
  // Emit the event
  eventEmitter.emit('gertrude-clicked', { name: 'Gertrude' })
}
eventEmitter.on('gertrude-clicked', (payload) => {
  console.log(`ME was clicked!`)
})

// Gontrand component
const gontrand = document.querySelector('#gontrand')
gontrand.onclick = () => {
  // Listen to the event
  eventEmitter.on('gertrude-clicked', (payload) => {
    console.log(`${payload.name} (certainly Gertrude) was clicked!`)
    console.log(`I'm Gontrand, I'm listening to Gertrude clicks, and this is my "this":`, this)
  })
}
```

### The "handle and emit" way

Same as above, but instead of emitting the event, we can handle it and emit it to the others. That way, the event is handled by the component itself and then emitted to the global event emitter. Then, other components can listen to it.

This way is less usable as the event have not the same handling process for each component. Some components will handle it and emit it again, some others will just listen to it. It is not consistent, thus the context is not the same into the `onclick` handler, and `this` is not the same: it is the HTML element not its "code representation".

```js
// Gertrude component
const eventEmitter = new EventEmitter();
const gertrude = document.querySelector('#gertrude')
gertrude.onclick = () => {
  // Handle the event
  console.log(`OMG ME was clicked! and this is my HTML element this:`, this)

  // Emit the event
  eventEmitter.emit('gertrude-clicked', { name: 'Gertrude' })
}

// Gontrand component
const gontrand = document.querySelector('#gontrand')
gontrand.onclick = () => {
  // Listen to the event
  eventEmitter.on('gertrude-clicked', (payload) => {
    console.log(`${payload.name} (certainly Gertrude) was clicked!`)
  })
}
```

### The "tell me when you are clicked" way

Same as above but here Gontrand tells Gertrude to do something when she is clicked.

Here the context is totally different. Gertrude is not emitting an event, she is just listening to her own `onclick` event. Gontrand is not listening to an event, he is just telling Gertrude to do something when she is clicked.

```js
// Gontrand component
const gertrude = document.querySelector('#gertrude');
gertrude.onclick = () => {
  console.log(`OMG Gertrude was clicked! (Gontrand told me to say it for him but he'll never know I did it) this "this" is my HTML element this:`, this)
}
```

## Conclusion

When we want to handle an event we have to:

  1. know its name
  2. listen to it through the global event emitter (register a listener)
  3. handle it
  4. unregister the listener when we don't want to handle it anymore (optional)

### Wat to not do

  1. ask the component to do something when something happens to him (the "tell me when you are clicked" way)
  2. handle the event and emit it again (the "handle and emit" way)
