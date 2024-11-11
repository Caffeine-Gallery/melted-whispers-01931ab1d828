export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  return IDL.Service({
    'getLocation' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'getMenu' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getRemainingDays' : IDL.Func([], [IDL.Int], ['query']),
    'isOperating' : IDL.Func([], [IDL.Bool], ['query']),
    'makeReservation' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, Time],
        [IDL.Opt(IDL.Text)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
