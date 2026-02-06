export function sortMembers(members = [], { generationFilter = undefined, excludeMentors = false } = {}) {
    if (!Array.isArray(members)) return [];

    const mentors = excludeMentors ? [] : members.filter(m => m.position === 'Mentor');
    let others = members.filter(m => m.position !== 'Mentor');

    if (generationFilter !== undefined && generationFilter !== null) {
        others = others.filter(m => m.generation === generationFilter);
    }

    others.sort((a, b) => (Number(a.generation) || 0) - (Number(b.generation) || 0));

    return [...mentors, ...others];
}

export default { sortMembers };
