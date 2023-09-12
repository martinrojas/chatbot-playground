<script lang="ts">
	import { tokenTotalCount } from "$lib/nanostores/tokenStore";
</script>

<div class="stats shadow">
	<div class="stat">
		<div class="stat-title">Token Calculator</div>
		<div class="stat-value">{$tokenTotalCount}</div>
		<div class="stat-desc">tokens (max: 4,096)</div>
	</div>
</div>
