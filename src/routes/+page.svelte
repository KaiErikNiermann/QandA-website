<script lang="ts">
    import type { PageData } from "./$types";

    type db_listing = {
        question: string;
        guild_id: string;
        status: number;
    };
    let questions: db_listing[] = [];
    let curr_guild_id: string;

    export let data: PageData;

    data.questions.forEach((question) => {
        let new_question: db_listing = {
            question: question.question,
            guild_id: question.guild_id,
            status: question.status,
        };
        questions.push(new_question);
    });
</script>

<h1>FaQ page</h1>

<input bind:value={curr_guild_id}/>
<ul>
    {#each questions as question}
        {#if question.guild_id == curr_guild_id}
            <li>
                <h3>
                    {question.question}
                </h3>
            </li>
        {/if}
    {/each}
</ul>