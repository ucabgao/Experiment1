import State from '../stores/state';

State.on('route:update', (route) => {
    State.get().set({ route });
});
