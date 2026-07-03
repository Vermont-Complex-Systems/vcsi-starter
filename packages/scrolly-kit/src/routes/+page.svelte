<!-- Kitchen sink: every element markdown can emit, with zero classes beyond
     .page. If this page looks decent, the "untweaked default" contract holds. -->
<article class="page">
	<h1>scrolly-kit defaults</h1>
	<p>
		This is the package's kitchen sink. Everything below is bare HTML styled only by
		<code>reset.css</code>, <code>tokens.css</code>, and <code>typography.css</code> — no classes,
		no custom CSS. See the <a href="/story">story playground</a> for the layouts.
	</p>

	<h2>Typography</h2>
	<p>
		Body text with a <a href="https://example.com">link</a>, some <strong>bold</strong>, some
		<em>italics</em>, and inline <code>code</code>. Text properties are set once on
		<code>body</code> and inherit everywhere.
	</p>

	<h3>A third-level heading</h3>
	<p>Paragraphs get a bottom margin; font size and line-height are inherited, not pinned.</p>

	<h4>Fourth level</h4>
	<h5>Fifth level</h5>
	<h6>Sixth level</h6>

	<h2>Lists</h2>
	<ul>
		<li>Unordered item one</li>
		<li>Item two with <code>inline code</code></li>
		<li>Item three</li>
	</ul>
	<ol>
		<li>Ordered item one</li>
		<li>Item two</li>
	</ol>

	<h2>Blockquote</h2>
	<blockquote>
		<p>Quotes render slightly larger than prose, with a colored left border.</p>
	</blockquote>

	<h2>Code block</h2>
	<pre><code>const step = $state(0);
// layouts own space; components fill it</code></pre>

	<h2>Table</h2>
	<table>
		<thead>
			<tr><th>Token</th><th>Default</th><th>Notes</th></tr>
		</thead>
		<tbody>
			<tr><td><code>--vcsi-font-size-base</code></td><td>clamp(1.125rem, 1.2vw, 1.25rem)</td><td>responsive by construction</td></tr>
			<tr><td><code>--vcsi-space-md</code></td><td>1rem</td><td>spacing scale</td></tr>
			<tr><td><code>--vcsi-radius-md</code></td><td>6px</td><td>border radius</td></tr>
		</tbody>
	</table>
</article>
