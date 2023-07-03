<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    let curr_guild_id: string;
</script>

<h1>FaQ page</h1>

<input bind:value={curr_guild_id} />
<ul>
    {#each $page.data.questions as question}
        {#if question.guild_id == curr_guild_id}
            <li>
                <h3>
                    Q:
                    {question.question}
                </h3>
                <h3>
                    A:
                    {question.answer}
                </h3>
                <form method="POST" action="?/add_answer" use:enhance>
                    <label>
                        your answer:
                        <input name="answer" />
                        <input
                            type="hidden"
                            name="question"
                            value={question.question}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </li>
        {/if}
    {/each}
</ul>
