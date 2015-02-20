ig.module(
    'game.entities.<%%= name %>'
)
.requires(
    'impact.entity'
)
.defines(function() {

    Entity<%%= nameCapitalized %> = ig.Entity.extend({

        size: { x: <%%= width %>, y: <%%= height %> },
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/<%%= name %>.png', <%%= width %>, <%%= height %>),

        init: function (x, y, settings) {

            this.parent(x, y, settings);

            this.addAnim('init', 1, [0]);
        },

        update: function() {

            this.parent();
        }
    });
});
