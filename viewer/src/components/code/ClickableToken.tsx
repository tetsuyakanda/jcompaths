import React, { useContext, useState } from 'react';

import { TokenWithTrace } from 'ddapi/token';

import { SelectedMethod, SelectedTokens } from 'App';
import Status from 'components/atoms/Status';

interface TokenProps {
  token: TokenWithTrace;
}

const ClickableToken = (props: TokenProps) => {
  const { token } = props;
  const { selectedTokens, selectTokens } = useContext(SelectedTokens);
  const { selectedMethod } = useContext(SelectedMethod);
  const status = token.diffStatuses[selectedMethod.exeIndex];
  if (!status) {
    return (
      <Status tokenType={status} isSelected={false}>
        {token.image}
      </Status>
    );
  } else {
    const isSelected = selectedTokens.some((t) => (t.key === token.key));
    const onClick = () => {
      let newTokens;
      if (isSelected) {
        newTokens = selectedTokens.filter((t) => (t.key !== token.key));
      } else {
        newTokens = [...selectedTokens, token];
      }
      selectTokens(newTokens);
    }
    return (
      <Status tokenType={status} isSelected={isSelected} onClick={onClick}>
        {token.image}
      </Status>
    );
  }
};

interface SpaceTokenProps {
  length: number;
}
export const SpaceToken = ({ length }: SpaceTokenProps) => {
  const space = new TokenWithTrace(
    {
      image: ' '.repeat(length),
    },
    'both'
  );
  return <ClickableToken token={space} />;
};

export default ClickableToken;
