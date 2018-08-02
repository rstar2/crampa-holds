<template>
	<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.823774624486!2d23.327096951270107!3d42.68627512232777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa850a36163275%3A0xe891b67e82fe0e93!2z0LHRg9C7LiDigJ7QldCy0LvQvtCz0Lgg0Lgg0KXRgNC40YHRgtC-INCT0LXQvtGA0LPQuNC10LLQuOKAnCA2NSwgMTE0MiDQptC10L3RgtGK0YAsINCh0L7RhNC40Y8!5e0!3m2!1sbg!2sbg!4v1533200370464"
	    :width="width" :height="height"
		frameborder="0" style="border:0"
		aria-label="Google Maps" title="Google Maps" allowfullscreen>
	</iframe>
</template>

<script>

export default {
	props: {
		location: String,
		width: {
			type: String,
			default: '650',
		},
		height: {
			type: String,
			default: '400',
		},
	}
};
</script>

