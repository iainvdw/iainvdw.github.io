# Complexity in CSS (and how to avoid it)

Probably everyone who has worked with CSS, ran into one of several possible issues you could have with CSS. The issues could be caused by high selector specificity, overuse of `!important`, conflicts in source order, or some other issue. Some developers have even come to hate CSS because of these issues. Or even blame "the cascade" (which is what defines how CSS works) and try to circumvent it. After all, CSS does stand for "Cascading Style Sheets".

But are these issues really caused by CSS itself? Or by the way we're writing CSS? I believe we're creating our own problems and should be looking at our own code instead of the technology.

## CSS is simple
Anybody can start learning CSS. It's quite easy to pick up, the learning curve is not too steep and you can start on anything you'd like, be it font styling, layout or even animations. There's a couple of things you need to know in CSS, like selectors, properties and their values. They're concepts that aren't that hard to grasp, and once you know what they are, you can start writing CSS!

***But...***

## It isn't easy

Let me start with this quote by Jeremy Keith from his post ["CSS"](https://adactio.com/journal/12571)

> [CSS] is simple in the sense of “not complex”, but that doesn’t mean it’s easy. Mistaking “simple” for “easy” will only lead to heartache.
> 
> [...]
> 
> I can’t help but think that they would be less frustrated if they would accept that CSS is not easy. Simple, yes, but not easy. Using CSS at scale has a learning curve, just like any powerful technology. The way to deal with that is not to hammer the technology into a different shape, but to get to know it, understand it, and respect it.

Like Jeremy Keith is saying, architecting CSS at scale can be quite a challenge as you might run into the issues mentioned earlier. Learning what each part of the cascade does (specificity, inheritance, source order, etc.) and how it affects the elements on a page, can become quite a challenge.

But I've come to believe there _is_ a way of writing maintainable, structured and scalable CSS without running into any of the major issues listed above. Basically, all of the problems named above (and their solutions) boil down to one thing: structure.

## Structure
My current setup for CSS structure is a combination of these technologies and methodologies:

* A preprocessor (like LESS or Sass)
* ITCSS
* BEM
* OOCSS (in the form of mixins)

Each layer in this stack gives me the "power" to finetune the structure of my CSS. Control over parts of CSS's cascade even. I'll elaborate what advantages (and disadvantages) each layer brings in a bit, but first let me explain all these abbreviations.

**ITCSS** is short for Inverted Triangle CSS. It was coined by Harry Roberts of [CSS Wizardry](https://www.csswizardry.com) a couple of years ago. ITCSS is a methodology that dictates how your stylesheet is structured, in the way of ordering your CSS by increasing reach and specificity.

The second one, **BEM**, is an abbreviation for Block, Element, Modifier. This methodology defines how you should group or "namespace" your selectors together to form the standalone styling for a component.

The last one, **OOCSS**, is short for Object-oriented CSS. This was started by Nicole Sullivan back in 2009. It consists of two main principles:

* Separate structure and skin
* Separate container and content

I'll explain these two further down in the article.

### ITCSS

The ITCSS methodology itself consists of several layers. Let me show you what I mean with this visual:

***IMG OF ITCSS TRIANGLE HERE***

Let me give a quick rundown of what each layer consists of:

1. Settings — This contains all you project's configuration and variables
2. Tools — Tools consist of reusable mixins and/or functions for your projects
3. Generic — 3rd party libraries or frameworks
4. Base — Default styling for bare HTML elements
5. Objects — Small, reusable classes for layout or content
6. Components — Larger UI components, like a header, menu, article list, etc.
7. Trumps — Highly specific overrides for layout, colors, breakpoints, etc.

The first two layers (*"settings"* and *"tools"*) do not generate output in the form of selectors with styling attached. They're there for configuration and setting up reusable pieces of calculation or styling in your project.

The *"generic"* layer is the first layer that could generate output, as this is the layer you would put external vendor libraries that come with their own stylesheet.

The *"base"* layer is the starting layer for **your** CSS. You start putting sensible defaults of styling there for bare HTML elements (no classes here yet!), like font-sizes for body text and headings, list styling and form element styling.

*"Objects"* and *"components"* are the layers I had the most trouble with in the beginning, as it wasn't immediately clear to me what the difference was between an object and a component. The definition I settled on is something like this:

* Objects are smaller pieces of styling with little to no aesthetic, used for defining layout or styling content.
* Components are larger groups of styling that bring together a major piece of layout or content, e.g. a site header, product listing or a checkout form.

The last layer, *"trumps"*, are for extremely specific overrides or helpers. For instance, forcing an element to float left or right, setting a color explicitly, hiding content on a certain breakpoint, etc. These selectors (and only these) may even use `!important` as they're only used as a last resort to achieve something.

### BEM

As a kid, I liked playing with Lego blocks. There was this huge pile of blocks I could arrange in any order to build something that I want. I could build cars, houses, castles, farms and more. The possibilities were endless. Awesome right? Right!

With BEM, short for *"Block, Element, Modifier"*, it gets a bit like playing with Lego's again. You break down the pages of your website into smaller, reusable components called "Blocks", and arrange these blocks in a particular order to form a page, create smaller bits of layout or style some content. Just like Lego's! Yay!

In a way, you're creating more boundaries in your CSS with BEM. But instead at the structural level of your stylesheet with using ITCSS, you're creating boundaries between pieces of content or layout of your website. Each Block has its own kind of responsibility to style a small piece of your website.

Blocks may consist of multiple elements, but there's only one container element, which is the boundary of the Block. Each element that belongs to a Block, is simply called Element and is *"bound"* to that Block by namespacing the class used to style the Element.

Blocks and Elements may have variations in styling as well, which is achieved with Modifiers. Modifiers define a small set of rules that deviate from the default styling of a Block or Element. Say you have a list that's vertically layed out by default, but you want that list to be horizontal in a certain situation. If major parts of styling overlap between the horizontal and vertical layouts, theres probably no need to create an entire new horizontal list component. Modifiers are the better option in this case.

Lets look at an example how this might look:

**HTML:**

```html
<!-- Block boundary -->
<article class="article">
	<!-- Element of ".article" Block -->
	<h1 class="article__title">Title of the article<h1>
	
	<!-- Element of ".article" Block with modifier -->
	<p class="article__intro article__intro--large">This is a small intro<p> 
</article>
```

**CSS:**

```css
/* Block */
.article {
	border: 1px solid #ccc;
	padding: 10px;
}

/* Element of .article Block, separated by two underscores */
.article__title {
	font-size: 2rem;
}

/* Another Element of .article */
.article__intro {
	font-weight: bold;
}

/* Modifier of the .artictle__intro Element, separated with two dashes */
.article__intro--large {
	font-size: 1.25rem;
}
```

As you can see in the HTML and CSS above, you can quite easily see the distinct relationshops of all the elements. The class `.article` sets a boundary for a new Block. Child elements may indicate their relationship to that Block by using a classname that starts with the Block classname. The same holds true for Modifiers, and they're always defined last in a classname. Modifiers may be applied to Blocks directly as well, so a classname like `.article--highlighted` is perfectly fine.

The style used here (double underscores for Elements, double dashes for Modifiers) is my personal preference but there are different styles of BEM you might come across in other places. Single underscores and dashes, dashes for Elements and underscores for Modifiers, completely different characters, all perfectly fine. Discuss this with your team and agree on one style of BEM or it might get a bit messy when mixing different styles in a project.

I tend to split up my CSS at the BEM component level as well, where the name of the file is also the name of the base Block class. E.g. `article.scss` only contains the `.article` Block, its Elements and its modifiers. It gives each file a single "responsibility" for a single component of a project.

### OOCSS & mixins

OOCSS is short for Object Oriented CSS. Pioneered by Nicole Sullivan, she defined two main principles to keep in mind. These two principles are:

* Separate container and content
* Separate structure and skin

Lets break these principles down.

**Separate container and content**

This one is the easier principle of the two. It's best explained with a short code example:

```css
#article h1 {
	font-size: 2em;
	font-weight: bold;
}

#sidebar h2 {
	font-size: 2em;
	font-weight: bold;
}
```

As you can see here, we have two heading styles, both of which are the same.  The problem with this approach is that styles aren't reusable and both styles are dependant on container elements, `#article` and `#sidebar`. If we would extract this style, we could come up with a shorter, reusable class like this:

```css
.title {
	font-size: 2em;
	font-weight: bold;
}
```

This class can be applied to the `h1` and `h2` elements in both places, while not being dependant on their container! We have now successfully separated the styling of the content from their placement in a certain container.

**Separate structure and skin**

CSS has a lot of properties, most of which fall into one of these categories: structure and skin. But what is the difference between these two? Let me show in an example.

Say we have a couple of button classes that contains this styling:

```css
.btn {
	border: 2px solid firebrick;
	border-radius: 5px;
	padding: 5px;
	color: white;
	background: tomato;
}

.btn-alt {
	border: 1px solid forestgreen;
	border-radius: 3px;
	padding: 5px;
	color: black;
	background: limegreen;
}
```

We've got two button styles, each with their own look and feel. But what if we wanted to introduce a new color? Or even a new size? We'd have to repeat some CSS properties into a new class to define the new button, as we can't reuse existing classes. Looking at the properties of these buttons, we can see they overlap a bit. They both have padding and borders, but differ visually.

Let's extract these properties into separat classes in a large example:

```css
/* Structural */
.btn-base {
	border: 2px solid;
	padding: 5px;
}

.btn-small {
	border: 1px solid;
	padding: 3px;
}

.btn-large {
	border: 3px solid;
	padding: 7px
}

/* Skin */
.btn-main {
	border-color: firebrick;
	border-radius: 5px;
	color: white;
	background: tomato;
}

.btn-secondary {
	border-color: forestgreen;
	border-radius: 3px;
	color: black;
	background: limegreen;
}

.btn-tertiary {
	border-color: dodgerblue;
	border-radius: 10px;
	color: white;
	background: deepskyblue;
}
```

Look, we now have a small set of classes we can use to compose different types of buttons! Whether it's a small main button or a large secondary one, we can combine two classes to get a new type of button!

Splitting the styles up like this separates the "concerns" of groups of CSS properties. There are structural classes that control the layout, and skin classes that define how it looks. This gives a couple of advantages. We're not repeating CSS properties anymore, and we've gained the flexibilty to "mix and match" classes to form a new button.

There is a small drawback to this though, and that's having to use multiple classes in your HTML as well. Also, the classnames are pretty abstract and aren't really descriptive anymore. Using the power of CSS preprocessors, we can convert these classes into mixins and then use those mixins to compose our components.

One way of converting the classes above to mixins would be like this:

```css
/* Structural */
@mixin btn-size-default {
	border: 2px solid;
	padding: 5px;
}

@mixin btn-size-small {
	border: 1px solid;
	padding: 3px;
}

@mixin btn-size-large {
	border: 3px solid;
	padding: 7px
}

/* Skin */
@mixin btn-style-main {
	border-color: firebrick;
	border-radius: 5px;
	color: white;
	background: tomato;
}

@mixin btn-style-secondary {
	border-color: forestgreen;
	border-radius: 3px;
	color: black;
	background: limegreen;
}

@mixin btn-style-tertiary {
	border-color: dodgerblue;
	border-radius: 10px;
	color: white;
	background: deepskyblue;
}

/* Compose button classes using mixins */
.btn-call-to-action {
	@include btn-size-default;
	@include btn-style-main;
}

.btn-secondary-action {
	@include btn-size-small;
	@include btn-style-secondary;
}

.btn-submit {
	@include btn-size-large;
	@include btn-style-tertiary;
}
```

"Ok... So what do we gain with this?", you might ask. Very good question! The benefits might not be clear immediately when you see this for the first time. But in short, the benefits are:

* Less HTML cluttering with classes: no more `<button class="btn-base btn-secondary btn-rounded btn-ghost">`
* The ability to use descriptive classes: `<button class="btn-call-to-action">`
* Easier to determine the look of each class by reading the mixins it includes
* Unused mixins do not generate output in your CSS
* It keeps styling in your CSS, not your HTML
* As such, in theory, it's be easier to restyle components as you would only have to change the CSS instead of changes classes in HTML
* Having to name your classes and including the mixins, it helps keep track of similar looking elements
* Duplication of properties from mixins that are used multiple times are handled **really** well with Gzip (See [Mixins vs extends](https://tech.bellycard.com/blog/sass-mixins-vs-extends-the-data/))

This methodology can be applied to other piecies of styling as well. Like defining base styles for boxes with a border, padding and box-shadow. Or setting a border-radius which is consistent everywhere. It's really powerful and gives you the control over your CSS exactly where and when you need it, without being dependent on extra HTML classes or having to override styling from parent elements.

## Conclusion

The combination of ITCSS, BEM and OOCSS mixins have really given me the power and control I need over my CSS. The cascade is being managed effectively, source order is controlled with ITCSS, components have clear boundaries with BEM and OOCSS mixins give flexibility and control of granuler styling.

With this article I hope I've given you some extra insights into writing and architecting CSS for large scale projects.

Should you have any questions, remarks or suggestions, you can find me on [Twitter](https://twitter.com/iain_vdw)!
