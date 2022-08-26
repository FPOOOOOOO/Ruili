package abc.ney.armee.jet.utils.ansi;

import lombok.Getter;

/**
 * See https://en.wikipedia.org/wiki/ANSI_escape_code#3/4_bit
 * <p>
 * Copied from org.springframework.boot.ansi.AnsiColor
 *
 * @author Phillip Webb
 * @author Geoffrey Chandler
 */
@Getter
public enum AnsiForegroundColor implements AnsiEscapeCode {
    BLACK("30"),
    RED("31"),
    GREEN("32"),
    YELLOW("33"),
    BLUE("34"),
    MAGENTA("35"),
    CYAN("36"),
    WHITE("37"),

    BRIGHT_BLACK("90"),
    BRIGHT_RED("91"),
    BRIGHT_GREEN("92"),
    BRIGHT_YELLOW("93"),
    BRIGHT_BLUE("94"),
    BRIGHT_MAGENTA("95"),
    BRIGHT_CYAN("96"),
    BRIGHT_WHITE("97"),

    DEFAULT_FOREGROUND_COLOR("39");
    private String ansiCode;

    AnsiForegroundColor(String code) {
        this.ansiCode = code;
    }

}
